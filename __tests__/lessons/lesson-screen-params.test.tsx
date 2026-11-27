import { render, screen } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';

import { LessonScreen, NOT_FOUND_TITLE } from '@/features/lessons/screens/lesson-screen';

// A real URL always gives one string, so the odd params are faked here.
jest.mock('expo-router', () => {
  const actual = jest.requireActual('expo-router');
  const { createElement } = jest.requireActual<typeof import('react')>('react');
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    ...actual,
    useLocalSearchParams: jest.fn(),
    Stack: { Screen: () => null },
    Link: ({ children }: { readonly children: import('react').ReactNode }) =>
      createElement(Text, null, children),
  };
});

const mockParams = jest.mocked(useLocalSearchParams);

test.each([
  ['an array param', { id: ['present-simple', 'past-simple'] }],
  ['a missing param', {}],
  ['an empty string', { id: '' }],
])('%s shows the not found page and never throws (covers: AC-6)', async (_name, params) => {
  mockParams.mockReturnValue(params);

  await render(<LessonScreen />);

  expect(screen.getByRole('heading', { name: NOT_FOUND_TITLE })).toBeOnTheScreen();
});
