#include <iostream>
using namespace std;

int main() {
    // Solution for countsetbit.cpp
    cout << "Hello World!" << endl;
    int n=10;
    int count=0;
    while(n!=0)
    {
        if(n&1==1)
        {
            count++;
        }
        n>>=1;
    }
    cout<<count;
    return 0;
}
