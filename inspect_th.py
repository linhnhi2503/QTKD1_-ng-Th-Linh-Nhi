with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('rawTableHeader')
print('rawTableHeader at:', pos)
if pos != -1:
    print(text[pos-200:pos+1500])
