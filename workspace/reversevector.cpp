#include <iostream>
#include<vector>
using namespace std;
int main() {
    

    
        vector<int> brr={1,2,3,4,5};
        int size =brr.size();
        int i=0;
        int j=size-1;
        while(i<=j)
        {
            int temp=brr[i];
            brr[i]=brr[j];
            brr[j]=temp;
            i++,j--;
        }
        i=0;
        while(i<size)
        {
            cout<<brr[i];
            i++;
           
        }

}
