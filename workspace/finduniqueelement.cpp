#include <iostream>
#include<vector>
using namespace std;
int findunique(vector<int> arr)
{
    int size=arr.size();
    
    for(int i=0; i<size; i++)
    {   int count=0;
        for(int j=i+1; j<size; j++)
        {
            if(arr[i]==arr[j])
            {
                count++;
            }
            if(count==0)
            {
                return i;
            }
        }
    }

}
int main() {
    // Solution for finduniqueelement.cpp
    
    cout << "Hello World!" << endl;
    vector<int> arr={1,2,3,2,1};
    cout<<findunique(arr);
    return 0;
}
