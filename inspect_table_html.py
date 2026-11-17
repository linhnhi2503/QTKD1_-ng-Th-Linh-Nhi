with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect rawTable HTML
pos = text.find('id="rawTable"')
print(text[pos-200:pos+1200])
