#include <iostream>
using namespace std;

int main() {
    // Solution for prime.cpp
    cout << "Hello World!" << endl;
    int n=100;
    
    for(int i=1; i<=n; i++)
    {   int count=0;
        for(int j=1; j<=i; j++)
        {
            if(i%j==0)
        {
            count++;
        }
        }
        if(count==2)
        {
            cout<<i<<endl;
        }

        

    }
    return 0;
}
