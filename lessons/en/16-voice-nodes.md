# Lesson 16: Voice & Nodes

OpenClaw supports voice interaction through a speech-to-text and text-to-speech pipeline, as well as a distributed node architecture that lets you run lightweight OpenClaw clients on mobile devices and other edge hardware. This lesson covers voice wake capabilities, the speech pipeline, and how to set up and manage distributed nodes.

## Learning Objectives

- Enable voice wake and speech recognition
- Understand the speech-to-text and text-to-speech pipeline
- Set up mobile device nodes
- Configure distributed node architecture
- Manage node communication and state synchronization

## Prerequisites

- Completion of Lesson 15 (Canvas & A2UI)
- A microphone and speaker (for local voice) or a Twilio account (for phone-based voice)

## Voice Wake Capability

Voice wake allows your assistant to listen for a wake word and then process spoken commands. This is the "Hey Siri" or "OK Google" equivalent for OpenClaw.

Enable voice wake in the configuration:

```json5
{
  voice: {
    enabled: true,
    wakeWord: "atlas",            // The word that activates listening
    wakeWordSensitivity: 0.7,     // 0.0 (very sensitive) to 1.0 (strict)
    language: "en-US",            // Voice recognition language
    continuous: false,            // Keep listening after first command
    inputDevice: "default",       // Audio input device name
    outputDevice: "default",      // Audio output device name
  },
}
```

The daemon uses a lightweight, local wake word detection model that runs continuously with minimal CPU usage. When the wake word is detected, the system switches to full speech recognition mode and begins streaming audio to the speech-to-text pipeline.

On Linux, you may need to install `portaudio` for audio device access:

```bash
# Ubuntu/Debian
sudo apt install portaudio19-dev

# Then install the OpenClaw voice module
openclaw voice install
```

## Speech-to-Text Pipeline

Once the wake word is detected, OpenClaw streams audio to a speech-to-text (STT) service. The pipeline supports multiple providers:

```json5
{
  voice: {
    stt: {
      provider: "openai",         // "openai" | "google" | "deepgram" | "whisper-local"
      model: "whisper-1",
      language: "en-US",
      // For local Whisper (no API costs)
      // provider: "whisper-local",
      // model: "base",
    },
  },
}
```

The STT provider converts the audio stream into text, which is then processed through the normal prompt assembly pipeline (workspace files + session history + memory) and sent to the LLM.

### STT Configuration Tips

- **OpenAI Whisper** provides the best balance of accuracy and cost for English.
- **Google Speech-to-Text** supports more languages and has lower latency.
- **Deepgram** offers real-time streaming with very low latency.
- **Local Whisper** runs entirely on your machine with no API costs but requires a decent CPU/GPU.

## Text-to-Speech Responses

After the LLM generates a text response, OpenClaw converts it to speech using a text-to-speech (TTS) provider:

```json5
{
  voice: {
    tts: {
      provider: "openai",         // "openai" | "google" | "elevenlabs" | "piper-local"
      model: "tts-1",
      voice: "alloy",             // Voice profile name
      speed: 1.0,                 // Speech speed (0.5 - 2.0)
    },
  },
}
```

Available voices depend on the provider. OpenAI offers `alloy`, `echo`, `fable`, `onyx`, `nova`, and `shimmer`. ElevenLabs provides a wider selection of natural-sounding voices.

### Voice Personalization

You can match the TTS voice to your assistant's personality by configuring it in IDENTITY.md:

```markdown
## Voice Configuration

When responding via voice:
- Use a calm, measured pace.
- Pause briefly between topics.
- Avoid abbreviations that sound awkward when spoken (e.g., say "PostgreSQL" not "Postgres").
```

## Mobile Device Nodes

A node is a lightweight OpenClaw client that connects to your main daemon over WebSocket. Nodes are designed for resource-constrained devices like smartphones, tablets, and Raspberry Pi units.

### Setting Up a Node

Install the OpenClaw node client on your mobile device:

```bash
# On a Raspberry Pi or similar Linux device
npm install -g @openclaw/node

# Connect to your daemon
openclaw node connect ws://your-server:3000/node --token ${NODE_TOKEN}
```

The node client is minimal -- it handles audio input/output, sensor data, and local display rendering. All LLM processing happens on the main daemon.

### Node Features

- **Microphone access** for voice commands
- **Speaker access** for TTS responses
- **GPS/location** for location-aware responses
- **Camera** for image input (vision-capable models)
- **Accelerometer/gyroscope** for gesture detection (experimental)

### Node Configuration

```json5
// On the main daemon, configure node authentication
{
  nodes: {
    enabled: true,
    auth: {
      type: "token",
      tokens: ["${NODE_TOKEN_1}", "${NODE_TOKEN_2}"],
    },
    maxNodes: 10,                  // Maximum concurrent node connections
  },
}
```

## Distributed Node Architecture

For larger deployments, OpenClaw supports a hub-and-spoke architecture:

```
                    +------------------+
                    |   Main Daemon    |
                    |  (LLM, Memory,   |
                    |   Channels)      |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
        +-----+-----+ +----+----+ +-------+-----+
        | Node:     | | Node:   | | Node:       |
        | Office    | | Mobile  | | Raspberry Pi|
        | Speaker   | | App     | | Smart Mirror|
        +-----------+ +---------+ +-------------+
```

Each node connects to the main daemon via a persistent WebSocket. The daemon manages all node connections and routes messages between nodes and channels.

### State Synchronization

Nodes synchronize state with the daemon:

```json5
{
  nodes: {
    sync: {
      interval: 5000,             // Sync every 5 seconds
      state: ["memory", "schedule", "channels"],
      // Nodes receive memory updates and schedule changes
      // so they can act autonomously during brief disconnections
    },
  },
}
```

When a node temporarily loses its WebSocket connection (e.g., a phone going through a tunnel), it continues operating with its last synchronized state. Once reconnected, it syncs any local changes (voice commands received while offline) back to the daemon.

### Node Groups

Organize nodes into groups for targeted messaging:

```json5
{
  nodes: {
    groups: {
      "living-room": ["speaker-1", "smart-mirror"],
      "office": ["desktop-1", "speaker-2"],
      "mobile": ["phone-alice", "phone-bob"],
    },
  },
}
```

Send a message to a specific node group via the CLI:

```bash
openclaw node send --group living-room "Dinner is ready"
openclaw node send --node speaker-1 "Play some jazz"
```

## Summary

Voice and node capabilities extend OpenClaw beyond text-based chat into the physical world. The speech pipeline supports multiple STT and TTS providers, with options for both cloud and local processing. Distributed nodes let you deploy lightweight clients on mobile devices, smart speakers, and IoT hardware, all managed by a central daemon. In the final lesson, we will bring everything together in a capstone project that builds a complete 24/7 AI assistant.
