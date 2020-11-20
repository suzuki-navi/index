
# python argv
# 1つ目のパラメータ
a = int(sys.argv[1])

# python last atChar
if len(path) > 0 and path[-1:] != "/":
    path = path + "/"

# python lastindexof find rfind
s = "abcbd"
print(s.rfind("b"))
# => 3

# python string startswith
if s.startswith(prefix):
    ...

# python string endswith
if s.endswith(suffix):
    ...

# python stderr puts print
print("illegal s3 path", file = sys.stderr)

# python regexp match group
s3_path_pattern = 's3://([^/]+)(/.*)?'
match = re.match(s3_path_pattern, s3_path)
if not match:
    print("illegal s3 path", file = sys.stderr)
    sys.exit(1)
# match.group() でマッチした全体
# match.group(n) でキャプチャ
bucket = match.group(1)
path = ''
if match.group(2):
    path = match.group(2)[1:]

# python append
# リストの最後に追加
lst.append(el)

# python insert
# リストの先頭に追加
lst.insert(0, el)

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

# python elif elsif else if
if ...:
    ...
elif ...:
    ...
else:
    ...

# python loop for range
for i in range(2, 6):
    # 2
    # 3
    # 4
    # 5

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

# python range list array
[n for n in range(2, 10)]
# [2, 3, 4, 5, 6, 7, 8, 9]

# python max array list
max(lst)

