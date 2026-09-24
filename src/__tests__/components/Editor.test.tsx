import FullRichTextEditor from '@/components/BookWriter/FullRichTextEditor';

describe('live editor module', () => {
  it('exports the rich text editor used by the writer', () => {
    expect(FullRichTextEditor).toEqual(expect.any(Function));
  });
});
