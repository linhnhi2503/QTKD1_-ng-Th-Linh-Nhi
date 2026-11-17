with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('threeui-video-elem')
print("Position:", pos)
print(text[pos-100:pos+400])
