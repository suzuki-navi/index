
# python last atChar
if len(path) > 0 and path[-1:] != "/":
    path = path + "/"

# python regexp match group
import re
s3_path_pattern = 's3://([^/]+)(/.*)?'
match = re.match(s3_path_pattern, s3_path) # 文字列全体がマッチするかどうか
if match:
    # match.group() でマッチした全体 (またはgroup(0))
    # match.group(n) でキャプチャ (nは1始まり)
    bucket = match.group(1)
    path = ''
    if match.group(2):
        path = match.group(2)[1:]
else:
    print("illegal s3 path")

# python string split explode
s = ",a,b,,d,"
lst = s.split(",")
print(lst)
# ['', 'a', 'b', '', 'd', '']

# python list array append
# リストの最後に追加
lst.append(el)

# python list array insert
# リストの先頭に追加
lst.insert(0, el)

# python list array pop
# リストの先頭を取得して削除
lst.pop(0)

# python lambda nonlocal
# Pythonの無名関数の外側の変数にアクセス
def f2(lam):
    lam(10)
    lam(20)
    lam(30)
def f():
    total = 0
    def l(el):
        nonlocal total
        total += el
    f2(l)
    print(total)

# python iterator loop for foreach
for el in it:
    ...

# python iterator loop while foreach stopiteration
while True:
    try:
        el = next(it)
    except StopIteration:
        break
    ...

# python array list reverse reversed
r = reversed(lst)

# python bigint
m = 1_000_000_007

# python bigint atoi
m = int("1_000_000_007") # 1000000007
#
try:
    print(int("a"))
except:
    print("Error")
# => Error

# python range list array
[n for n in range(2, 10)]
# [2, 3, 4, 5, 6, 7, 8, 9]

# python max array list
max(lst)

# python iterator next stopiteration try except exception
def nextElement(it):
    try:
        return next(it)
    except StopIteration:
        return False

# python string compare strcmp
"abc" < "def"
"abc" > "Def"

# python iterator pushback push_back
class PushBackIterator:
    def __init__(self, src):
        self._src = src
        self._buf = []
    def __iter__(self):
        return self
    def __next__(self):
        if len(self._buf) > 0:
            elem = self._buf[-1]
            self._buf = self._buf[:-1]
            return elem
        return self._src.__next__()
    def push_back(self, elem):
        self._buf.append(elem)

# python sort list array
# return a new sorted list
sorted(lst)
sorted(iterable)

# python sort list array
# modify the list in-place
lst.sort()

# python json tostring tojson
# https://docs.python.org/ja/3/library/json.html
import json
json_str = json.dumps(obj) # 1行
json_str = json.dumps(obj, indent = "  ") # pretty print

# python newline
s = "abc" + \
    "def"
s = ("abc" +
     "def")

