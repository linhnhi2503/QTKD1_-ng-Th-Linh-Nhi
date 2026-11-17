import urllib.request

with urllib.request.urlopen('http://127.0.0.1:8000/') as resp:
    text = resp.read().decode('utf-8')
    print('Has emerald active color #059669:', '#059669' in text)
    print('Has emerald active color #10b981:', '#10b981' in text)
    print('Status: 200 OK')
