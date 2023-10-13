import subprocess
import json as JSON
comando = "whisper /Users/lordkaito/Downloads/probando.mp3"

result = subprocess.run(comando, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

toPrint = result["text"]
print(toPrint)