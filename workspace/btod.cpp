#include <iostream>
#include<math.h>
using namespace std;

int main() {
    // Solution for btod.cpp
    int n=10101;
    int i=0;
    int ans=0;
    while(n!=0)
    {
        int ld=n%10;
        ans=ld*pow(2,i)+ans;
        n/=10;
        i++;
    }
    cout<<ans;
    return 0;
}
