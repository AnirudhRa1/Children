import os
import sys
import whisper

# Add local ffmpeg path if needed
ffmpeg_dir = os.path.join(os.path.dirname(__file__), "ffmpeg", "bin")
os.environ["PATH"] = f"{ffmpeg_dir};" + os.environ.get("PATH", "")

def main():
    if len(sys.argv) != 2:
        sys.stderr.write("Usage: python whisper_transcribe.py <audio-file-path>\n")
        sys.exit(1)

    audio_path = sys.argv[1]

    if not os.path.exists(audio_path):
        sys.stderr.write(f"ERROR_TRANSCRIBE: File not found: {audio_path}\n")
        sys.exit(1)

    try:
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)
        print(result["text"].strip())  # ✅ THIS goes to stdout
    except Exception as e:
        sys.stderr.write(f"ERROR_TRANSCRIBE: {e}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
