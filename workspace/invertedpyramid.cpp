#include <iostream>
using namespace std;

int main() {
    // Solution for invertedpyramid.cpp
    cout << "Hello World!" << endl;
    // *****
    //  ***
    //   *
    int n=3;
    for(int i=1; i<=n; i++)
    {
        for(int j=1; j<=i-1; j++)
        {
            cout<<"  ";
        }
        for(int k=1; k<=2*(n-i)+1; k++)
        {
            cout<<"* ";
        }
        cout<<endl;
    }
    return 0;
}
