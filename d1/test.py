import sys, os

def test_data(path):
    fdata = []
    with open(path) as f:
        fdata = f.readlines()

    data = []
    for v in fdata:
        data.append(int(v))
    
    print('D1: P1: ' + str(increased_mesurements(data)))

    print("D1: P2: " + str(increased_mesurements(sum_following(data, 3))))

def sum_following(data, sumsize):
    sdata = []
    for i in range(len(data) - sumsize + 1):
        sum = 0
        for j in range(sumsize):
            sum += data[i + j]
        sdata.append(sum)
        print(f"{i}: {sum}")
    return sdata


def increased_mesurements(data):
    count = 0
    previous = data[0]
    for v_i in range(1, len(data)):
        if previous < data[v_i]:
            count += 1
            # print(str(data[v_i]) + " (increased)")
        # else:
            # print(str(data[v_i]) + " (decreased)")
        previous = data[v_i]
    return count


if __name__ == "__main__":
    test_data("./d1/data.txt")