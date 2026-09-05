#include <iostream>
#include <vector>
using namespace std;
void pairs(vector<int> arr)
{
    int size=arr.size();
    for(int i=0; i<size; i++)
    {
        for(int j=0; j<size; j++)
        {
            cout<<"("<<arr[i]<<","<<arr[j]<<")";
        }
        cout<<endl;
    }
}
int main() {
    // Solution for printallpossiblepairsinanarray.cpp
    cout << "Hello World!" << endl;
    vector<int> arr={1,2,3,4,5};
    pairs(arr);
    return 0;
}
