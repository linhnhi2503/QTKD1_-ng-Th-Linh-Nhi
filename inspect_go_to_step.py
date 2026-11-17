with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function goToStep(stepNum)')
print(text[pos:pos+1200])
