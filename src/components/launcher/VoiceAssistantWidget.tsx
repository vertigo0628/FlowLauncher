'use client';
import 'regenerator-runtime/runtime';
import { useState, useEffect } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion, AnimatePresence } from 'framer-motion';
import { parseCommand } from '@/app/actions';
import { INSTALLED_APPS } from '@/lib/apps';
import { useToast } from '@/hooks/use-toast';

type VoiceAssistantWidgetProps = {
  onCommand: (intent: string, entities: any) => void;
};

export default function VoiceAssistantWidget({ onCommand }: VoiceAssistantWidgetProps) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const processTranscript = async () => {
        if (!listening && transcript && !isProcessing) {
            await handleCommand(transcript);
        }
    };
    processTranscript();
  }, [listening, transcript]);
  
  const handleListen = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
    }
  };

  const handleCommand = async (commandText: string) => {
    if (!commandText.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await parseCommand({
        command: commandText,
        installedApps: INSTALLED_APPS.map(app => app.name),
      });

      toast({
          title: 'Assistant',
          description: result.response,
      });

      if (result.intent !== 'unrecognized') {
        onCommand(result.intent, result.entities);
      }

    } catch (error) {
      console.error("Failed to parse command:", error);
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "I had trouble understanding that. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex justify-center items-center p-4 h-28">
        <p className="text-xs text-center text-muted-foreground">
            Voice recognition not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-28">
       <AnimatePresence>
        {(listening || isProcessing) && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg text-foreground h-7 px-4 text-center"
          >
            {isProcessing ? "Thinking..." : (transcript || "Listening...")}
          </motion.p>
        )}
      </AnimatePresence>
      <Button
        size="icon"
        className="w-16 h-16 rounded-full shadow-lg z-20 bg-primary text-primary-foreground hover:bg-primary/90 transform transition-transform duration-300 relative"
        onClick={handleListen}
        disabled={isProcessing}
      >
        <AnimatePresence mode="popLayout">
          {isProcessing ? (
             <motion.div key="loader" initial={{scale:0}} animate={{ scale:1, rotate: 360 }} exit={{scale:0}} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Loader className="w-8 h-8" />
             </motion.div>
          ) : listening ? (
            <motion.div key="mic-off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <MicOff className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div key="mic-on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Mic className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
