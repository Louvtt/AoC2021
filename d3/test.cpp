#include <iostream>
#include <fstream>

#include <string>

#include <vector>
#include <bitset>

#include <cmath>

constexpr int BITRATE = 12;

using data_t = std::vector<std::bitset<BITRATE>>;

void printBitset(std::bitset<BITRATE> bit)
{
    for(int i = BITRATE - 1; i >= 0; --i) printf("%d", (int)bit.test(i));
    printf("\n");
}

data_t getData(std::string file)
{
    std::ifstream f;
    // f.exceptions(std::ios::badbit, std::ios::failbit);
    data_t data;
    try
    {
        f.open(file, std::ios::in);

        std::string l;
        // printf("Data: \n");
        while(std::getline(f, l))
        {
            std::bitset<BITRATE> bitv(l);
            data.push_back(bitv);
            // printBitset(bitv);
        }

        f.close();
    }
    catch(const std::exception& e)
    {
        std::cerr << "ERROR:" << e.what() << '\n';
    }
    printf("Got %d data.\n", data.size());
    return data;
}

std::vector<int> getBitCount(data_t data)
{
    std::vector<int> bit_count { };
    for(int i = 0; i < BITRATE; ++i) bit_count.push_back(0);
    for(auto d : data)
        for(int i = 0; i < BITRATE; ++i)
            bit_count[i] += (int)d.test(i);
    
    printf("Bitcount: ");
    for(auto c : bit_count)
        printf("%d, ", c);
    printf("\n");

    return bit_count;
}

std::bitset<BITRATE> convertBitCountToBitset(std::vector<int> bit_count, size_t datasize)
{
    std::bitset<BITRATE> bit;
    for(int i = 0; i < BITRATE; ++i)
        bit.set(i, (bit_count[i] >= (datasize * .5f)));
    
    printf("Bitcount_to_bit: ");
    printBitset(bit);
    return bit;
}

/////////////////////////////////////////
// PART 1

int calculateGammaRate(data_t data)
{
    std::vector<int> bit_count = getBitCount(data);
    std::bitset<BITRATE> bit = convertBitCountToBitset(bit_count, data.size());
    return (int)bit.to_ulong();
}

int calculateEspilonRate(data_t data)
{
    std::vector<int> bit_count = getBitCount(data);
    std::bitset<BITRATE> bit = convertBitCountToBitset(bit_count, data.size()).flip();
    return (int)bit.to_ulong();
}

/////////////////////////////////////////
// PART 2

int calculateO2Rate(data_t data)
{
     data_t filtered = { data };
    for(int i = BITRATE - 1; i >= 0; --i)
    {
        // find commom bit
        int counter = 0;
        for(int j = 0; j < filtered.size(); ++j)
        {
            // printBitset(filtered[j]);
            counter += (int)filtered.at(j).test(i);
        }
        int hs = ceilf(filtered.size() * .5);
        bool commonBit = (counter >= hs);
        if(counter == filtered.size()) continue;
        if(counter == 0)               continue;
        // printf("%d: cb=%d (1: %d / %d)\n", i, (int)commonBit, counter, filtered.size());

        // filter via bit criteria
        data_t tmp {};
        for(int j = 0; j < filtered.size(); ++j)
        {
            if(filtered.at(j).test(i) == commonBit)
            {
                // printBitset(filtered[j]);
                tmp.push_back(filtered.at(j));
            }
        }
        // printf("\n ----- \n");

        filtered = { tmp };

        if(filtered.size() == 1) break;
        if(filtered.size() == 0) return 0;
    }
    
    return (int)filtered.front().to_ulong();
}

int calculateCO2Rate(data_t data)
{
    data_t filtered = { data };
    for(int i = BITRATE - 1; i >= 0; --i)
    {
        // find commom bit
        int counter = 0;
        for(int j = 0; j < filtered.size(); ++j)
        {
            // printBitset(filtered[j]);
            counter += (int)filtered.at(j).test(i);
        }
        int hs = ceilf(filtered.size() * .5);
        bool lcommonBit = !(counter >= hs);
        if(counter == filtered.size()) continue;
        if(counter == 0)               continue;
        // printf("%d: cb=%d (1: %d / %d)\n", i, (int)!lcommonBit, counter, filtered.size());

        // filter via bit criteria
        data_t tmp {};
        for(int j = 0; j < filtered.size(); ++j)
        {
            if(filtered.at(j).test(i) == lcommonBit)
            {
                // printBitset(filtered[j]);
                tmp.push_back(filtered.at(j));
            }
        }
        // printf("\n ----- \n");

        filtered = { tmp };

        if(filtered.size() == 1) break;
        if(filtered.size() == 0) return 0;
    }
    
    return (int)filtered.front().to_ulong();
}

int main(int argc, char* argv[])
{
    data_t data = getData("D:/Dev/adventOfCODE21/d3/data.txt");

    printf("\n======= PART1 =======\n\n");
    int g = calculateGammaRate(data);
    printf("Gamma Rate        : %d\n", g);
    int e = calculateEspilonRate(data);
    printf("Epsilon Rate      : %d\n", e);
    printf("Power Consumption : %d\n", g * e);

    printf("\n======= PART2 =======\n\n");
    int o = calculateO2Rate(data);
    printf("O2 Generation Rate : %d\n", o);
    int c = calculateCO2Rate(data);
    printf("CO2 Scrubber Rate  : %d\n", c);
    printf("Life support rating: %d\n", o * c);


    return 0;
}