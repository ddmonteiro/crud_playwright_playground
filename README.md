# CRUD Playground - Playwright Test Automation

Playwright test automation framework using TypeScript and Page Object Model for testing CRUD operations.

### Installation

```bash
npm install
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run in headed mode
npm run test:headed

# Run UI mode
npm run test:ui

# View report
npm run test:report
```

### Configuration

Configure via `.env` file:
```env
BASE_URL=http://localhost:3000/
HEADLESS=true
TIMEOUT=30000
```

## Project Structure

```
├── pages/          # Page Object Models
├── tests/          # Test specifications
├── fixtures/       # Test fixtures
├── utils/          # Utilities (DataFactory, helpers)
└── playwright.config.ts
```

## Identified Issues

### Critical
- **Records not persisted after page refresh** 
- **Timezone issue when inserting new records** 
- **Duplicate records are allowed** 

### Functional
- **Required fields not highlighted properly** 
- **Spaces not trimmed in name and profession inputs** - Allows invalid names like "Ana " or empty values with just spaces
- **Profession has no character validation** - No minimum or maximum length validation

### UI/UX
- **Minimum name length too restrictive** - Rejects valid names like "Bob" or "Ana"
- **Unrealistic DOBs are valid** - Accepts dates like 1800 or today's date
- **Hard to navigate calendar picker** - Difficult to select dates in past years
- **DOB input doesn't preformat** - Typing "19890101" doesn't format to "1989-01-01"
- **Website not responsive**
- **Inconsistent heading capitalization** - "edit users" should be "Edit Users"

### Accessibility
- **No autocomplete attributes in form** - Missing autocomplete hints for better UX
