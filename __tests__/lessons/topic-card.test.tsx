import { fireEvent, render, screen } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';

import { getTopic, TopicCard, type TopicId } from '@/features/lessons';
import { themes } from '@/ui/theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { colors } = themes.light;

beforeEach(() => {
  jest.mocked(useColorScheme).mockReturnValue('light');
});

test('a written topic: title, subtitle, accent chevron and one link (spec 0004, covers: AC-1, AC-2)', async () => {
  const onPress = jest.fn();
  await render(<TopicCard topicId="present-simple" variant="plain" onPress={onPress} />);

  const card = screen.getByRole('link', { name: 'Present Simple, czas teraźniejszy prosty' });
  expect(screen.queryByText('Lekcja jeszcze niegotowa')).toBeNull();
  const icon = screen.getByTestId('icon', { includeHiddenElements: true });
  expect(icon.props).toMatchObject({ name: 'chevron.right', tintColor: colors.accentText });

  await fireEvent.press(card);
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('the summary shows only when asked (spec 0004, covers: AC-1)', async () => {
  const summary = getTopic('present-simple')?.summary ?? '';
  expect(summary).not.toBe('');

  await render(
    <TopicCard topicId="present-simple" variant="accent" showSummary onPress={jest.fn()} />,
  );
  expect(screen.getByText(summary)).toBeOnTheScreen();

  await render(<TopicCard topicId="present-simple" variant="accent" onPress={jest.fn()} />);
  expect(screen.queryByText(summary)).toBeNull();
});

test('an unwritten topic is muted and says so in words (spec 0004, covers: AC-5)', async () => {
  await render(<TopicCard topicId="past-simple" variant="plain" onPress={jest.fn()} />);

  expect(
    screen.getByRole('link', {
      name: 'Past Simple, czas przeszły prosty, lekcja jeszcze niegotowa',
    }),
  ).toBeOnTheScreen();
  expect(screen.getByText('Lekcja jeszcze niegotowa')).toBeOnTheScreen();
  expect(screen.getByText('Past Simple')).toHaveStyle({ color: colors.inkMuted });
  expect(screen.getByTestId('icon', { includeHiddenElements: true }).props.tintColor).toBe(
    colors.inkMuted,
  );
});

test('an id that is not in the catalog renders nothing (spec 0004)', async () => {
  await render(<TopicCard topicId={'nie-ma' as TopicId} variant="plain" onPress={jest.fn()} />);

  expect(screen.toJSON()).toBeNull();
});

test('the tile layout has no chevron and fills its cell (spec 0005, covers: AC-5)', async () => {
  await render(
    <TopicCard topicId="present-simple" variant="plain" layout="tile" onPress={jest.fn()} />,
  );

  const card = screen.getByRole('link', { name: 'Present Simple, czas teraźniejszy prosty' });
  expect(card).toHaveStyle({ flexGrow: 1 });
  expect(screen.queryByTestId('icon', { includeHiddenElements: true })).toBeNull();
});
