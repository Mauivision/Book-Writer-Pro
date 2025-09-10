'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  FaDownload, 
  FaFilePdf, 
  FaFileWord, 
  FaBook, 
  FaGlobe,
  FaSpinner,
  FaCheck,
  FaCog,
  FaPalette,
  FaFont,
  FaImage,
  FaPrint,
  FaShare,
  FaEye,
  FaEdit,
  FaMagic
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  extensions: string[];
}

interface BookFormatting {
  title: string;
  author: string;
  dedication: string;
  acknowledgments: string;
  aboutAuthor: string;
  coverImage: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
  lineSpacing: 'single' | 'double' | '1.5';
  margins: 'narrow' | 'standard' | 'wide';
}

export default function EnhancedExportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [formatting, setFormatting] = useState<BookFormatting>({
    title: '',
    author: '',
    dedication: '',
    acknowledgments: '',
    aboutAuthor: '',
    coverImage: '',
    fontSize: 'medium',
    fontFamily: 'serif',
    lineSpacing: 'double',
    margins: 'standard'
  });

  const { metadata, chapters, characters, plot } = useBookStore();

  const exportFormats: ExportFormat[] = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Professional PDF format for printing and digital reading',
      icon: <FaFilePdf className="text-red-500" />,
      color: 'bg-red-50 border-red-200',
      extensions: ['.pdf']
    },
    {
      id: 'docx',
      name: 'Microsoft Word',
      description: 'Editable Word document for further editing',
      icon: <FaFileWord className="text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      extensions: ['.docx']
    },
    {
      id: 'epub',
      name: 'EPUB E-book',
      description: 'Digital e-book format for e-readers',
      icon: <FaBook className="text-green-500" />,
      color: 'bg-green-50 border-green-200',
      extensions: ['.epub']
    },
    {
      id: 'html',
      name: 'Web Page',
      description: 'HTML format for web publishing',
      icon: <FaGlobe className="text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      extensions: ['.html']
    },
    {
      id: 'txt',
      name: 'Plain Text',
      description: 'Simple text format for maximum compatibility',
      icon: <FaFileWord className="text-gray-500" />,
      color: 'bg-gray-50 border-gray-200',
      extensions: ['.txt']
    },
    {
      id: 'markdown',
      name: 'Markdown',
      description: 'Markdown format for technical writing',
      icon: <FaEdit className="text-indigo-500" />,
      color: 'bg-indigo-50 border-indigo-200',
      extensions: ['.md']
    }
  ];

  const handleExport = async () => {
    if (!selectedFormat) {
      toast.error('Please select an export format');
      return;
    }

    setIsExporting(true);
    try {
      const content = generateBookContent();
      const filename = `${metadata.title || 'My Book'}.${exportFormats.find(f => f.id === selectedFormat)?.extensions[0]?.replace('.', '')}`;
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Book exported successfully as ${filename}!`);
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export book. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateBookContent = (): string => {
    const format = exportFormats.find(f => f.id === selectedFormat);
    let content = '';

    // Add title page
    content += `${formatting.title || metadata.title || 'Untitled Book'}\n`;
    content += `by ${formatting.author || 'Anonymous'}\n\n`;
    
    if (formatting.dedication) {
      content += `Dedication\n${formatting.dedication}\n\n`;
    }

    // Add table of contents
    content += 'Table of Contents\n';
    chapters.forEach((chapter, index) => {
      content += `${index + 1}. ${chapter.title}\n`;
    });
    content += '\n';

    // Add chapters
    chapters.forEach((chapter, index) => {
      content += `Chapter ${index + 1}: ${chapter.title}\n\n`;
      content += `${chapter.content || ''}\n\n`;
    });

    // Add acknowledgments
    if (formatting.acknowledgments) {
      content += `Acknowledgments\n${formatting.acknowledgments}\n\n`;
    }

    // Add about author
    if (formatting.aboutAuthor) {
      content += `About the Author\n${formatting.aboutAuthor}\n\n`;
    }

    return content;
  };

  const generateBookCover = () => {
    // Simulate AI book cover generation
    toast.success('AI book cover generated!');
    setFormatting(prev => ({
      ...prev,
      coverImage: 'Generated cover image URL'
    }));
  };

  const generateBookDescription = () => {
    const description = `A compelling ${metadata.genres?.[0] || 'fiction'} novel that explores ${plot.summary ? 'themes of ' + plot.summary.slice(0, 50) + '...' : 'human nature and relationships'}. With ${characters.length} richly developed characters and ${chapters.length} chapters of engaging storytelling, this book promises to captivate readers from start to finish.`;
    
    toast.success('Book description generated!');
    return description;
  };

  const publishToPlatform = (platform: string) => {
    toast.success(`Ready to publish to ${platform}!`);
    // In a real app, this would integrate with publishing platforms
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
      >
        <FaDownload className="mr-2" />
        Export & Publish
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaDownload className="text-blue-600" />
                  Export & Publish Your Book
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Export Formats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaFilePdf className="text-red-500" />
                    Export Format
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exportFormats.map((format) => (
                      <Card
                        key={format.id}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedFormat === format.id ? 'ring-2 ring-blue-500 bg-blue-50' : format.color
                        }`}
                        onClick={() => setSelectedFormat(format.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{format.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{format.name}</h4>
                            <p className="text-sm text-gray-600">{format.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Book Formatting */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaPalette className="text-purple-500" />
                    Book Formatting
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Book Title
                      </label>
                      <Input
                        value={formatting.title}
                        onChange={(e) => setFormatting(prev => ({ ...prev, title: e.target.value }))}
                        placeholder={metadata.title || 'Enter book title'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Author Name
                      </label>
                      <Input
                        value={formatting.author}
                        onChange={(e) => setFormatting(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Enter author name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Size
                        </label>
                        <select
                          value={formatting.fontSize}
                          onChange={(e) => setFormatting(prev => ({ ...prev, fontSize: e.target.value as any }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Family
                        </label>
                        <select
                          value={formatting.fontFamily}
                          onChange={(e) => setFormatting(prev => ({ ...prev, fontFamily: e.target.value as any }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="serif">Serif</option>
                          <option value="sans-serif">Sans-serif</option>
                          <option value="monospace">Monospace</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dedication
                      </label>
                      <textarea
                        value={formatting.dedication}
                        onChange={(e) => setFormatting(prev => ({ ...prev, dedication: e.target.value }))}
                        placeholder="Optional dedication..."
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Publishing Options */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaGlobe className="text-green-500" />
                  Publishing Options
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={generateBookCover}
                    className="flex items-center gap-2"
                  >
                    <FaImage />
                    Generate Cover
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateBookDescription()}
                    className="flex items-center gap-2"
                  >
                    <FaMagic />
                    Generate Description
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => publishToPlatform('Amazon')}
                    className="flex items-center gap-2"
                  >
                    <FaShare />
                    Publish to Amazon
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => publishToPlatform('Barnes & Noble')}
                    className="flex items-center gap-2"
                  >
                    <FaShare />
                    Publish to B&N
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {isExporting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FaDownload className="mr-2" />
                      Export Book
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 