#include <iostream>
using namespace std;

int main() {
    // input {
    //    0 1 2
    // 0 {1,2,3},
    // 1 {4,5,6},
    // 2 {7,8,9}}
    // output   0 1 2
    //        0 1 4 7
    //        1 2 5 8
    //        2 3 6 9
    // Solution for coloumwise2darraytraversel.cpp
    int arr[][3]={{1,2,3},{4,5,6},{7,8,9}};
    for(int i=0; i<3; i++)
    {
        for(int j=0; j<3; j++)
        {
            cout<<arr[j][i]<<" ";
        }
        cout<<endl;
    }

    return 0;
}
