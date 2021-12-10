#include <iostream>
#include <array>

#define printBuf 0
#if printBuf
    #define PRNT(x) std::cout << x
#else
    #define PRNT(x)
#endif

int testdata[] = { 3,4,3,1,2 };
int data[]     = { 4,3,4,5,2,1,1,5,5,3,3,1,5,1,4,2,2,3,1,5,1,4,1,2,3,4,1,4,1,5,2,1,1,3,3,5,1,1,1,1,4,5,1,2,1,2,1,1,1,5,3,3,1,1,1,1,2,4,2,1,2,3,2,5,3,5,3,1,5,4,5,4,4,4,1,1,2,1,3,1,1,4,2,1,2,1,2,5,4,2,4,2,2,4,2,2,5,1,2,1,2,1,4,4,4,3,2,1,2,4,3,5,1,1,3,4,2,3,3,5,3,1,4,1,1,1,1,2,3,2,1,1,5,5,1,5,2,1,4,4,4,3,2,2,1,2,1,5,1,4,4,1,1,4,1,4,2,4,3,1,4,1,4,2,1,5,1,1,1,3,2,4,1,1,4,1,4,3,1,5,3,3,3,4,1,1,3,1,3,4,1,4,5,1,4,1,2,2,1,3,3,5,3,2,5,1,1,5,1,5,1,4,4,3,1,5,5,2,2,4,1,1,2,1,2,1,4,3,5,5,2,3,4,1,4,2,4,4,1,4,1,1,4,2,4,1,2,1,1,1,1,1,1,3,1,3,3,1,1,1,1,3,2,3,5,4,2,4,3,1,5,3,1,1,1,2,1,4,4,5,1,5,1,1,1,2,2,4,1,4,5,2,4,5,2,2,2,5,4,4 };

void processData(int* data, size_t count, const int& day)
{
    std::array<int, 9> buf = {
        0, 0, 0, 0, 0, 0, 0, 0, 0
    };
    for(int i = 0; i < count; ++i) buf[data[i]] += 1;

    for(int d = 1; d < day + 1; d++)
    {
        if(d < 10) std::cout << "After  " << d << " days: ";
        else       std::cout << "After "  << d << " days: ";
        
        std::array<int, 9> tmp = { 0, 0, 0, 0, 0, 0, 0, 0, 0 };
        for(int i = 0; i < 9; ++i)
        {
            if(i == 0) {
                tmp[6] += buf[0];
                tmp[8] += buf[0];
                continue;
            }
            tmp[i-1] += buf[i];
        }
        buf = { tmp };

        std::cout << "\n";
    }
    uint64_t total = 0;
    for(int i = 0; i < 9; ++i)
        total += buf[i];
    std::cout << "There is " << total << " lanternfishes.\n";
}


int main(int argc, char* argv[])
{
    int day = 80;
    if(argc > 1)
        day = atoi(argv[1]);

    size_t count = sizeof(testdata) / sizeof(int);
    std::cout << "Initial data Count: " << count << "\n";
    processData(testdata, count, day);
    
    return 0;
}