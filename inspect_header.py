with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_header = text.find('<header')
print(text[pos_header:pos_header+2500])
