#include <iostream>
using namespace std;

int main() {
    // Solution for sumfdigit.cpp
    int n=358;
    
    int sum=0;
    while(n!=0)
    {
        int ld=n%10;
        sum+=ld;
        n/=10;
    }
    cout<<sum;
    return 0;
}
