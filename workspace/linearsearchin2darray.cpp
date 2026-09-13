#include <iostream>
using namespace std;

int main() {
    // Solution for linearsearchin2darray.cpp
    int arr[3][3]={{1,2,3},{4,5,6},{7,8,9}};
    int t=6;
    for(int i=0; i<3; i++)
    {
        for(int j=0; j<3; j++)
        {
            if(arr[i][j]==t)
            {
                return arr[i],arr[j];
            }
        }
    }
    return 0;
}
