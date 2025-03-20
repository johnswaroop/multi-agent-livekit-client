"use client";

import { LoadingSVG } from "@/components/button/LoadingSVG";
import { ChatMessageType } from "@/components/chat/ChatTile";
import { ColorPicker } from "@/components/colorPicker/ColorPicker";
import { AudioInputTile } from "@/components/config/AudioInputTile";
import { ConfigurationPanelItem } from "@/components/config/ConfigurationPanelItem";
import { NameValueRow } from "@/components/config/NameValueRow";
import { PlaygroundHeader } from "@/components/playground/PlaygroundHeader";
import {
  PlaygroundTab,
  PlaygroundTabbedTile,
  PlaygroundTile,
} from "@/components/playground/PlaygroundTile";
import { useConfig } from "@/hooks/useConfig";
import { TranscriptionTile } from "@/transcriptions/TranscriptionTile";
import {
  BarVisualizer,
  VideoTrack,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useRoomInfo,
  useTracks,
  useVoiceAssistant,
} from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { QRCodeSVG } from "qrcode.react";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import tailwindTheme from "../../lib/tailwindTheme.preval";
import { Button } from "../button/Button";

export interface PlaygroundMeta {
  name: string;
  value: string;
}

export interface PlaygroundProps {
  logo?: ReactNode;
  themeColors: string[];
  onConnect: (
    connect: boolean,
    opts?: { token?: string; url?: string; metadata?: string }
  ) => void;
}

const headerHeight = 56;

const getPersonaDescription = (persona: string): string => {
  switch (persona) {
    case "mvp_water":
      return "A sales and support agent for MVP Water, specializing in water filtration and air purification solutions for residential use in Johnson City, Knoxville, and surrounding areas in Tennessee.";
    case "english_practice":
      return "A patient and supportive English language practice assistant that helps non-native speakers improve their language skills through conversation practice, grammar correction, vocabulary building, and pronunciation guidance.";
    case "c_interview":
      return "A technical interviewer specializing in C programming language, assessing knowledge of C concepts, data structures, algorithms, memory management, and problem-solving skills.";
    default:
      return "";
  }
};

export default function Playground({
  logo,
  themeColors,
  onConnect,
}: PlaygroundProps) {
  const { config, setUserSettings } = useConfig();
  const { name } = useRoomInfo();
  const [transcripts, setTranscripts] = useState<ChatMessageType[]>([]);
  const { localParticipant } = useLocalParticipant();
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("audio");

  const voiceAssistant = useVoiceAssistant();

  const roomState = useConnectionState();
  const tracks = useTracks();

  // Load selected persona from localStorage on component mount
  useEffect(() => {
    const savedPersona = localStorage.getItem("PERSONA");
    if (savedPersona) {
      setSelectedPersona(savedPersona);
    }
  }, []);

  // Save selected persona to localStorage when it changes
  useEffect(() => {
    if (selectedPersona) {
      localStorage.setItem("PERSONA", selectedPersona);
    }
  }, [selectedPersona]);

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setCameraEnabled(config.settings.inputs.camera);
      localParticipant.setMicrophoneEnabled(config.settings.inputs.mic);
    }
  }, [config, localParticipant, roomState]);

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localVideoTrack = localTracks.find(
    ({ source }) => source === Track.Source.Camera
  );
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );

  const onDataReceived = useCallback(
    (msg: any) => {
      if (msg.topic === "transcription") {
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        );
        let timestamp = new Date().getTime();
        if ("timestamp" in decoded && decoded.timestamp > 0) {
          timestamp = decoded.timestamp;
        }
        setTranscripts([
          ...transcripts,
          {
            name: "You",
            message: decoded.text,
            timestamp: timestamp,
            isSelf: true,
          },
        ]);
      }
    },
    [transcripts]
  );

  useDataChannel(onDataReceived);

  useEffect(() => {
    document.body.style.setProperty(
      "--lk-theme-color",
      // @ts-ignore
      tailwindTheme.colors[config.settings.theme_color]["500"]
    );
    document.body.style.setProperty(
      "--lk-drop-shadow",
      `var(--lk-theme-color) 0px 0px 18px`
    );
  }, [config.settings.theme_color]);

  const PersonaSelector = () => {
    return (
      <div className="w-full max-w-sm mx-auto mt-8 bg-[#1E1E1E] border border-[#333333] rounded-lg p-5">
        <h2 className="text-lg font-medium mb-4 text-center text-white">
          Choose Your Assistant
        </h2>
        <div className="relative mb-4">
          <select
            className="w-full appearance-none bg-[#2A2A2A] border border-[#3A3A3A] text-white py-2.5 px-3 pr-8 rounded-md focus:outline-none focus:border-[#4A4A4A] transition-all duration-200"
            onChange={(e) => setSelectedPersona(e.target.value)}
            value={selectedPersona || ""}
          >
            <option value="" disabled>
              -- Select a Persona --
            </option>
            {/* <option value="mvp_water">MVP Water Sales/Support Agent</option> */}
            <option value="english_practice">English Practice Assistant</option>
            {/* <option value="c_interview">
              C Programming Interview Assistant
            </option> */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {selectedPersona && (
          <div className="p-3 bg-[#2A2A2A] rounded-md border border-[#3A3A3A]">
            <h3 className="font-medium text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
              About this assistant
            </h3>
            <p className="text-gray-300 text-sm">
              {getPersonaDescription(selectedPersona)}
            </p>
          </div>
        )}

        {!selectedPersona && (
          <div className="p-3 bg-[#2A2A2A] rounded-md border border-[#3A3A3A] text-gray-400 text-sm text-center">
            <p>Select an assistant to see its description</p>
          </div>
        )}
      </div>
    );
  };

  const audioTileContent = useMemo(() => {
    const disconnectedContent = (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-700 text-center w-full ">
        <PersonaSelector />
        {selectedPersona.length > 0 && (
          <Button
            className="w-full max-w-sm mx-auto mt-4 py-3"
            accentColor={
              roomState === ConnectionState.Connected
                ? "red"
                : config.settings.theme_color
            }
            disabled={roomState === ConnectionState.Connecting}
            onClick={() => {
              onConnect(roomState === ConnectionState.Disconnected, {
                metadata: selectedPersona,
              });
            }}
          >
            {roomState === ConnectionState.Connecting ? (
              <LoadingSVG />
            ) : roomState === ConnectionState.Connected ? (
              "Disconnect"
            ) : (
              "Connect"
            )}
          </Button>
        )}
      </div>
    );

    const waitingContent = (
      <div className="flex flex-col items-center gap-2 text-gray-700 text-center w-full">
        <LoadingSVG />
        Waiting for audio track
      </div>
    );

    const visualizerContent = (
      <div className="flex flex-col items-center justify-center w-full">
        <div
          className={`flex items-center justify-center w-full h-60 [--lk-va-bar-width:30px] [--lk-va-bar-gap:20px] [--lk-fg:var(--lk-theme-color)]`}
        >
          <BarVisualizer
            state={voiceAssistant.state}
            trackRef={voiceAssistant.audioTrack}
            barCount={5}
            options={{ minHeight: 20 }}
          />
        </div>

        {selectedPersona && (
          <div className="w-full max-w-md mx-auto mt-6 bg-[#1E1E1E] border border-[#333333] rounded-lg p-5">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--lk-theme-color)] flex items-center justify-center text-white mr-4">
                {selectedPersona === "mvp_water" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {selectedPersona === "english_practice" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                )}
                {selectedPersona === "c_interview" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {selectedPersona === "mvp_water" &&
                    "MVP Water Sales/Support Agent"}
                  {selectedPersona === "english_practice" &&
                    "English Practice Assistant"}
                  {selectedPersona === "c_interview" &&
                    "C Programming Interview Assistant"}
                </h2>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-green-500 text-sm">Active</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#2A2A2A] rounded-md border border-[#3A3A3A] mb-4">
              <h3 className="font-medium text-xs text-gray-400 mb-2 uppercase tracking-wide">
                About this assistant
              </h3>
              <p className="text-gray-300">
                {getPersonaDescription(selectedPersona)}
              </p>
            </div>

            <div className="flex justify-between">
              <Button
                className="px-4 py-1 text-sm"
                accentColor="red"
                onClick={() => {
                  onConnect(false);
                  //redirect to the results page
                  window.location.href = "/results";
                }}
              >
                Get Results
              </Button>
            </div>
          </div>
        )}

        {!selectedPersona && (
          <div className="w-full max-w-md mx-auto mt-6 bg-[#1E1E1E] border border-[#333333] rounded-lg p-5 text-center">
            <p className="text-gray-400 mb-4">No assistant selected</p>
            <p className="text-sm text-gray-500 mb-6">
              Please select an assistant to continue
            </p>

            <div className="relative mb-4">
              <select
                className="w-full appearance-none bg-[#2A2A2A] border border-[#3A3A3A] text-white py-2.5 px-3 pr-8 rounded-md focus:outline-none focus:border-[#4A4A4A] transition-all duration-200"
                onChange={(e) => setSelectedPersona(e.target.value)}
                value={selectedPersona || ""}
              >
                <option value="" disabled>
                  -- Select a Persona --
                </option>
                <option value="mvp_water">MVP Water Sales/Support Agent</option>
                <option value="english_practice">
                  English Practice Assistant
                </option>
                <option value="c_interview">
                  C Programming Interview Assistant
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <Button
              className="w-full"
              accentColor="red"
              onClick={() => {
                onConnect(false);
              }}
            >
              Disconnect
            </Button>
          </div>
        )}
      </div>
    );

    if (roomState === ConnectionState.Disconnected) {
      return disconnectedContent;
    }

    if (!voiceAssistant.audioTrack) {
      return waitingContent;
    }

    return visualizerContent;
  }, [
    voiceAssistant.audioTrack,
    config.settings.theme_color,
    roomState,
    voiceAssistant.state,
    selectedPersona,
    getPersonaDescription,
    onConnect,
  ]);

  const chatTileContent = useMemo(() => {
    if (voiceAssistant.audioTrack) {
      return (
        <TranscriptionTile
          agentAudioTrack={voiceAssistant.audioTrack}
          accentColor={config.settings.theme_color}
        />
      );
    }
    return <></>;
  }, [config.settings.theme_color, voiceAssistant.audioTrack]);

  const settingsTileContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 h-full w-full items-start overflow-y-auto">
        {config.description && (
          <ConfigurationPanelItem title="Description">
            {config.description}
          </ConfigurationPanelItem>
        )}

        <ConfigurationPanelItem title="Settings">
          {localParticipant && (
            <div className="flex flex-col gap-2">
              <NameValueRow
                name="Room"
                value={name}
                valueColor={`${config.settings.theme_color}-500`}
              />
              <NameValueRow
                name="Participant"
                value={localParticipant.identity}
              />
            </div>
          )}
        </ConfigurationPanelItem>
        <ConfigurationPanelItem title="Status">
          <div className="flex flex-col gap-2">
            <NameValueRow
              name="Room connected"
              value={
                roomState === ConnectionState.Connecting ? (
                  <LoadingSVG diameter={16} strokeWidth={2} />
                ) : (
                  roomState.toUpperCase()
                )
              }
              valueColor={
                roomState === ConnectionState.Connected
                  ? `${config.settings.theme_color}-500`
                  : "gray-500"
              }
            />
            <NameValueRow
              name="Agent connected"
              value={
                voiceAssistant.agent ? (
                  "TRUE"
                ) : roomState === ConnectionState.Connected ? (
                  <LoadingSVG diameter={12} strokeWidth={2} />
                ) : (
                  "FALSE"
                )
              }
              valueColor={
                voiceAssistant.agent
                  ? `${config.settings.theme_color}-500`
                  : "gray-500"
              }
            />
          </div>
        </ConfigurationPanelItem>

        {localMicTrack && (
          <ConfigurationPanelItem
            title="Microphone"
            deviceSelectorKind="audioinput"
          >
            <AudioInputTile trackRef={localMicTrack} />
          </ConfigurationPanelItem>
        )}

        {config.show_qr && (
          <div className="w-full">
            <ConfigurationPanelItem title="QR Code">
              <QRCodeSVG value={window.location.href} width="128" />
            </ConfigurationPanelItem>
          </div>
        )}
      </div>
    );
  }, [
    config.description,
    config.settings,
    config.show_qr,
    localParticipant,
    name,
    roomState,
    localVideoTrack,
    localMicTrack,
    themeColors,
    setUserSettings,
    voiceAssistant.agent,
  ]);

  let mobileTabs: PlaygroundTab[] = [];

  return (
    <>
      <PlaygroundHeader
        title={config.title}
        logo={logo}
        githubLink={config.github_link}
        height={headerHeight}
        accentColor={config.settings.theme_color}
        connectionState={roomState}
        onConnectClicked={() =>
          onConnect(roomState === ConnectionState.Disconnected)
        }
      />
      <div
        className={`flex flex-col gap-4 py-4 grow w-full selection:bg-${config.settings.theme_color}-900`}
        style={{ height: `calc(100% - ${headerHeight}px)` }}
      >
        <div className="flex justify-center mb-2 border-b border-[#333333]">
          <div className="flex">
            <button
              onClick={() => setActiveTab("audio")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "audio"
                  ? `text-white border-b-2 border-[var(--lk-theme-color)]`
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Audio
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? `text-white border-b-2 border-[var(--lk-theme-color)]`
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "settings"
                  ? `text-white border-b-2 border-[var(--lk-theme-color)]`
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className={activeTab === "audio" ? "block" : "hidden"}>
            {audioTileContent}
          </div>
          <div className={activeTab === "chat" ? "block" : "hidden"}>
            {chatTileContent}
          </div>
          <div className={activeTab === "settings" ? "block" : "hidden"}>
            {settingsTileContent}
          </div>
        </div>
      </div>
    </>
  );
}
