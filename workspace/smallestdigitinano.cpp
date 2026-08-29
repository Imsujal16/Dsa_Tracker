#include <iostream>
#include<climits>
using namespace std;

int main() {
    // Solution for smallestdigitinano.cpp
    cout << "Hello World!" << endl;
    int n=1212013;
    int smallest=INT_MAX;
    while(n!=0)
    {
        int ld=n%10;
        if(ld<smallest)
        {
            smallest=ld;
        }
        n/=10;
    }
    cout<<smallest;
    return 0;
}
