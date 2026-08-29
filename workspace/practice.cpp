#include <iostream>
using namespace std;

int main() {
    // Solution for practice.cpp
    cout << "Hello World!" << endl;
    // ----5
    // ---45
    // --345
    // -2345
    // 12345
  for(int i = 1; i <= 5; i++)
{
    for(int j = 5 - i + 1; j <= 5; j++)
    {
        cout << j;
    }
    cout << endl;
}
    return 0;
}
