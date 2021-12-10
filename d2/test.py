import sys, os

def test_data(path):
    fdata = []
    with open(path) as f:
        fdata = f.readlines()

    data = []
    for v in fdata:
        data.append(v)

    part1(data)
    part2(data)

def part1(data):
    posX  = 0
    depth = 0

    for move in data:
        [cmd, v] = move.rstrip().split(" ")
        if cmd == "forward":
            posX += int(v)
        if cmd == "down":
            depth += int(v)
        if cmd == "up":
            depth -= int(v)
    
    print(f"P1: Pos: [ x:{posX}, depth: {depth} ]")
    print(posX * depth)

def part2(data):
    posX  = 0
    aim   = 0
    depth = 0

    for move in data:
        [cmd, v] = move.rstrip().split(" ")
        if cmd == "forward":
            posX  += int(v)
            depth += aim * int(v)
        if cmd == "down":
            aim += int(v)
        if cmd == "up":
            aim -= int(v)
    
    print(f"P2: Pos: [ x:{posX}, depth: {depth} ]")
    print(posX * depth)


if __name__ == "__main__":
    test_data("./d2/data.txt")