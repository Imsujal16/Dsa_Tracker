#include <iostream>
using namespace std;

int main() {
    // Solution for multiplyeachelementinaarrayby10.cpp 
    // Input: arr = [1, 2, 3, 4, 5]
    // Output: [10, 20, 30, 40, 50]
    cout << "Hello World!" << endl;
    int arr[5]={1, 2, 3, 4, 5};
    for(int i=0; i<5; i++)
    {
        arr[i]=arr[i]*10;
    }
    for(int i=0; i<5; i++)
    {
        cout<<arr[i];
    }
    return 0;
}
