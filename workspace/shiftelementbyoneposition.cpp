#include <iostream>
#include<vector>
using namespace std;
void shift(vector<int> arr)
{
      int size=arr.size();
        int last=arr[size-1];
        for(int i=0; i<size; i++)
        {
               if(i!=0)
               {
                 arr[i]=arr[i-1];
               
               }
               else
               {
                 arr[0]=last;
               }
        }
         for(int i=0; i<size; i++)
       {
        cout<<arr[i];
       }
       
}
int main() {
    // Solution for shiftelementbyoneposition.cpp
    cout << "Hello World!" << endl;
    vector<int> arr={1,2,3,4,5};
    shift(arr);
    return 0;

}
