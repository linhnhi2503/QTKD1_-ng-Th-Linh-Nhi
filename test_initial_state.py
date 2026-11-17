import urllib.request

with urllib.request.urlopen('http://127.0.0.1:8000/') as resp:
    text = resp.read().decode('utf-8')
    print('Initial rows is --:', 'id="s1TotalRows">--<' in text)
    print('Initial gross is --:', 'id="s1TotalGross">--<' in text)
    print('Initial groups is --:', 'id="s1TotalGroups">--<' in text)
    print('Has prompt placeholder:', 'Nhập bối cảnh doanh nghiệp của bạn' in text)
