#include <iostream>
#include<math.h>
using namespace std;
int dtob(int n)
{   float ans=0;
    int i=0;
    while(n>0)
    {
        int bit=n&1;
        ans=bit*pow(10,i)+ans;
        n/=2;
        i++;
    }
    return ans;
}

int main() {
    // Solution for decimaltobinaryconversion.cpp
    int n=10;
    cout<<dtob(n);

    return 0;
}
