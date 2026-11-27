import { fireEvent, render, screen } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';

import { BlockView, InlineText, plainText, SectionView, type Block } from '@/features/lessons';
import { themes } from '@/ui/theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { colors } = themes.light;

beforeEach(() => {
  jest.mocked(useColorScheme).mockReturnValue('light');
});

describe('InlineText (covers: AC-6)', () => {
  test('bold is semibold and highlight sits on the soft marker in ink', async () => {
    await render(<InlineText text="Dodaj **końcówkę** ==-s== tutaj." />);
    expect(screen.getByText('końcówkę')).toHaveStyle({ fontWeight: '600' });
    expect(screen.getByText('-s')).toHaveStyle({ backgroundColor: colors.accentSoft });
    expect(screen.getByText('-s')).not.toHaveStyle({ color: colors.accentText });
  });

  test('a link to a written lesson is underlined burnt orange and opens the topic', async () => {
    const onOpenTopic = jest.fn();
    await render(<InlineText text="Zobacz [[present-simple]]." onOpenTopic={onOpenTopic} />);

    const link = screen.getByRole('link', { name: 'Present Simple' });
    expect(link).toHaveStyle({ color: colors.accentText, textDecorationLine: 'underline' });

    await fireEvent.press(link);
    expect(onOpenTopic).toHaveBeenCalledWith('present-simple');
  });

  test('a link to an unwritten topic is muted but still a pressable link', async () => {
    const onOpenTopic = jest.fn();
    await render(
      <InlineText text="Użyj [[present-continuous|tego czasu]]." onOpenTopic={onOpenTopic} />,
    );

    const link = screen.getByRole('link', { name: 'tego czasu' });
    expect(link).toHaveStyle({ color: colors.inkMuted, textDecorationLine: 'underline' });
    await fireEvent.press(link);
    expect(onOpenTopic).toHaveBeenCalledWith('present-continuous');
  });

  test('without onOpenTopic a link is styled but not pressable', async () => {
    await render(<InlineText text="[[present-simple]]" />);
    expect(screen.getByRole('link', { name: 'Present Simple' }).props.onPress).toBeUndefined();
  });

  test('malformed markup and Polish letters render as plain text without a throw', async () => {
    await render(<InlineText text="Zażółć **gęślą jaźń" />);
    expect(screen.getByText('Zażółć **gęślą jaźń')).toBeOnTheScreen();
  });
});

describe('plainText (covers: AC-7)', () => {
  test('drops markup and turns links into their labels', () => {
    expect(
      plainText('Jeśli **teraz**, ==tak==, użyj [[present-continuous]] lub [[articles|a/an]].'),
    ).toBe('Jeśli teraz, tak, użyj Present Continuous lub a/an.');
  });
});

describe('BlockView (covers: AC-6, AC-7)', () => {
  test('text block', async () => {
    await render(<BlockView block={{ type: 'text', text: 'Zwykły tekst.' }} />);
    expect(screen.getByText('Zwykły tekst.')).toHaveStyle({ fontSize: 17, color: colors.ink });
  });

  test('table block shows caption, header and cells', async () => {
    await render(
      <BlockView
        block={{
          type: 'table',
          caption: 'Czasownik work',
          header: ['Osoba', 'Forma'],
          rows: [['he', 'He **works**']],
        }}
      />,
    );
    expect(screen.getByText('Czasownik work')).toHaveStyle({ fontSize: 13 });
    expect(screen.getByText('Osoba')).toHaveStyle({ fontSize: 16, fontWeight: '600' });
    expect(screen.getByText('works')).toHaveStyle({ fontWeight: '600' });
    expect(screen.getByText('he')).toHaveStyle({ fontSize: 16 });
  });

  test('examples block shows English strong, Polish muted and the note in italic caption', async () => {
    await render(
      <BlockView
        block={{
          type: 'examples',
          items: [{ en: 'She works.', pl: 'Ona pracuje.', note: 'Uwaga.' }],
        }}
      />,
    );
    expect(screen.getByText('She works.')).toHaveStyle({ fontWeight: '600' });
    expect(screen.getByText('Ona pracuje.')).toHaveStyle({ color: colors.inkMuted });
    expect(screen.getByText('Uwaga.')).toHaveStyle({ fontSize: 13, fontStyle: 'italic' });
  });

  test('tip block: the bulb reads "Wskazówka" and its topic link stays reachable', async () => {
    const onOpenTopic = jest.fn();
    await render(
      <BlockView
        block={{
          type: 'tip',
          text: 'Jeśli coś dzieje się **teraz**, w tej chwili, użyj [[present-continuous]].',
        }}
        onOpenTopic={onOpenTopic}
      />,
    );
    expect(screen.getByRole('image', { name: 'Wskazówka' })).toHaveProp('name', 'lightbulb.fill');
    // Not grouped into one element, or VoiceOver could not reach the link (regression).
    const link = screen.getByRole('link', { name: 'Present Continuous' });
    await fireEvent.press(link);
    expect(onOpenTopic).toHaveBeenCalledWith('present-continuous');
    expect(screen.queryByLabelText(/^Wskazówka: /)).toBeNull();
  });

  test('formula block is one element labelled with its parts', async () => {
    await render(
      <BlockView
        block={{ type: 'formula', label: 'Pytanie', parts: ['Do / Does', 'podmiot', 'czasownik'] }}
      />,
    );
    expect(
      screen.getByLabelText('Wzór, Pytanie: Do / Does plus podmiot plus czasownik'),
    ).toBeOnTheScreen();
  });

  test('formula block without a label', async () => {
    await render(<BlockView block={{ type: 'formula', parts: ['a', 'b'] }} />);
    expect(screen.getByLabelText('Wzór: a plus b')).toBeOnTheScreen();
  });

  test('mistake block never relies on colour alone', async () => {
    await render(
      <BlockView
        block={{
          type: 'mistake',
          wrong: 'He work every day.',
          right: 'He works every day.',
          note: 'Dodaj ==-s==.',
        }}
      />,
    );

    expect(screen.getByLabelText('Błędnie: He work every day.')).toBeOnTheScreen();
    expect(screen.getByLabelText('Poprawnie: He works every day.')).toBeOnTheScreen();
    expect(screen.getByText('He work every day.')).toHaveStyle({
      textDecorationLine: 'line-through',
    });

    const icons = screen.getAllByTestId('icon', { includeHiddenElements: true });
    expect(icons.map((icon) => [icon.props.name, icon.props.tintColor])).toEqual([
      ['xmark.circle.fill', colors.error],
      ['checkmark.circle.fill', colors.success],
    ]);
    expect(screen.getByText('-s')).toBeOnTheScreen();
  });

  test('list block shows every item', async () => {
    await render(<BlockView block={{ type: 'list', items: ['jeden', 'dwa'] }} />);
    expect(screen.getByText('jeden')).toBeOnTheScreen();
    expect(screen.getByText('dwa')).toBeOnTheScreen();
  });

  test('the block type list is closed', () => {
    // @ts-expect-error An eighth block type is not part of the model.
    const unknown: Block = { type: 'quiz', text: '?' };
    expect(unknown.type).toBe('quiz');
  });
});

describe('SectionView (covers: AC-6)', () => {
  test('renders a level 2 heading, then its blocks', async () => {
    await render(
      <SectionView section={{ title: 'Budowa', blocks: [{ type: 'text', text: 'Treść.' }] }} />,
    );
    expect(screen.getByRole('heading', { name: 'Budowa' })).toBeOnTheScreen();
    expect(screen.getByText('Treść.')).toBeOnTheScreen();
  });

  test('an empty section renders only the heading', async () => {
    await render(<SectionView section={{ title: 'Pusta', blocks: [] }} />);
    expect(screen.getByRole('heading', { name: 'Pusta' })).toBeOnTheScreen();
  });
});
