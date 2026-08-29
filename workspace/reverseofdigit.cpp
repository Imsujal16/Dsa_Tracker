#include <iostream>
using namespace std;

int main() {
    // Solution for reverseofdigit.cpp
    cout << "Hello World!" << endl;
    int n=123;
    int rev=0;
    while(n!=0)
    {
        int ld=n%10;
        rev=rev*10+ld;
        n/=10;
    }
    cout<<rev;
    return 0;
}
