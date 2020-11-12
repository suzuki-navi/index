
# shell stdout terminal
if [ -t 1 ]; then
    # 標準出力が端末の場合
    ...
fi

# shell argv array
# パラメータを配列にコピー
declare -a files=()
while [ $# -gt 0 ]; do
    arg="$1"
    files+=("$arg")
    shift
done

# shell array count size
# 配列のサイズ
echo ${#files[@]}

# shell array reference
# 配列の要素を参照
echo ${files[0]}

# shell array foreach
# 配列の要素でループ
for f in ${files[@]}; do
    echo "$f"
done

