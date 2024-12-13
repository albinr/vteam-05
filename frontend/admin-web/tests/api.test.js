const { fetchBikes } = require('@/app/bikes/api');

jest.mock('@/app/bikes/api');

test('fetchBikes returns data', async () => {
    const mockData = [{ id: 1, status: 'Available', battery: '85%' }];
    fetchBikes.mockResolvedValueOnce(mockData);

    const data = await fetchBikes();
    expect(data).toEqual(mockData);
    expect(fetchBikes).toHaveBeenCalledTimes(1);
});
