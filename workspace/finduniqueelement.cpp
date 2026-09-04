#include <iostream>
#include<vector>
using namespace std;
int findunique(vector<int> arr)
{
    int size=arr.size();
    for(int i=0; i<size; i++)
    {   int count=0;
        for(int j=0; j<size; j++)
        {
            if(arr[i]==arr[j])
            {
                count++;
            }
        }
         if(count==1)
            {
                return arr[i];
            }
    }
    return -1;

}
int main() {
    // Solution for finduniqueelement.cpp
    
    cout << "Hello World!" << endl;
    vector<int> arr={1,2,3,2,1};
    cout<<findunique(arr);
    return 0;
}
