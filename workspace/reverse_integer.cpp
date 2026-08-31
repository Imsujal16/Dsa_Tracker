#include <iostream>
using namespace std;

int main() {
    // Solution for reverse_integer.cpp
    cout << "Hello World!" << endl;
    int n=-123;
    int rev=0;
    int a=0;
    if(n==0)
    {
        return 0;
    }
    if(n<0)
    {
        a=1;
    }
    while(n!=0)
    {
        int ld=n%10;
        rev=rev*10+ld;
        n/=10;
    }
    if(a==1)
    {
        n=-rev;
    }
    cout<<n;
    
    return 0;
}
