#include <iostream>
#include<math.h>
using namespace std;
int binarytodecimal(int n)
{   int ans=0;
    int i=0;
    while(n>0)
    {   
        int ld=n%10;
        if(ld==1)
        {
        ans+=pow(2,i); 
        }
        n/=10;
        i++;
    }
    return ans;
}
int main() {
    // Solution for binarytodecimal.cpp
    int n=10101;
   
    cout <<binarytodecimal(n)<< endl;
    return 0;
}
