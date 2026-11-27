// expo-symbols draws SF Symbols natively. In Jest it becomes a plain View that keeps
// the symbol name and colour, so tests can check which icon shows (spec 0003).
jest.mock('expo-symbols', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    SymbolView: (props: Record<string, unknown>) =>
      createElement(View, { testID: 'icon', ...props }),
  };
});
