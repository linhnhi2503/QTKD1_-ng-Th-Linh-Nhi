with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function prevTablePage()')
print(text[pos-100:pos+800])
