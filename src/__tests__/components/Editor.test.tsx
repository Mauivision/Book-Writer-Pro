import { Editor } from '@/components/Editor';

describe('Editor module', () => {
  it('exports the chapter editor', () => {
    expect(Editor).toEqual(expect.any(Function));
  });
});
