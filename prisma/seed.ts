import { PrismaClient, BookStatus, MemberStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data arrays for generating realistic records
const bookTitles = [
    'The Great Gatsby', 'To Kill a Mockingbird', '1984', 'Pride and Prejudice', 'The Catcher in the Rye',
    'Animal Farm', 'Lord of the Flies', 'Brave New World', 'The Hobbit', 'Fahrenheit 451',
    'Jane Eyre', 'Wuthering Heights', 'Moby Dick', 'War and Peace', 'Crime and Punishment',
    'The Odyssey', 'The Iliad', 'Don Quixote', 'Hamlet', 'Macbeth',
    'The Divine Comedy', 'Paradise Lost', 'Beowulf', 'Canterbury Tales', 'Alice in Wonderland',
    'Frankenstein', 'Dracula', 'The Picture of Dorian Gray', 'Heart of Darkness', 'The Metamorphosis',
    'One Hundred Years of Solitude', 'Love in the Time of Cholera', 'The Stranger', 'The Plague', 'Siddhartha',
    'Steppenwolf', 'Demian', 'The Trial', 'The Castle', 'Ulysses',
    'A Portrait of the Artist', 'Dubliners', 'Mrs Dalloway', 'To the Lighthouse', 'The Waves',
    'Sons and Lovers', 'Women in Love', 'The Rainbow', 'Middlemarch', 'Silas Marner'
];

const authors = [
    'F. Scott Fitzgerald', 'Harper Lee', 'George Orwell', 'Jane Austen', 'J.D. Salinger',
    'William Golding', 'Aldous Huxley', 'J.R.R. Tolkien', 'Ray Bradbury', 'Charlotte Bronte',
    'Emily Bronte', 'Herman Melville', 'Leo Tolstoy', 'Fyodor Dostoevsky', 'Homer',
    'Miguel de Cervantes', 'William Shakespeare', 'Dante Alighieri', 'John Milton', 'Lewis Carroll',
    'Mary Shelley', 'Bram Stoker', 'Oscar Wilde', 'Joseph Conrad', 'Franz Kafka',
    'Gabriel Garcia Marquez', 'Albert Camus', 'Hermann Hesse', 'James Joyce', 'Virginia Woolf',
    'D.H. Lawrence', 'George Eliot', 'Charles Dickens', 'Ernest Hemingway', 'Mark Twain',
    'Nathaniel Hawthorne', 'Edgar Allan Poe', 'H.G. Wells', 'Jules Verne', 'Alexandre Dumas',
    'Victor Hugo', 'Gustave Flaubert', 'Emile Zola', 'Anton Chekhov', 'Nikolai Gogol',
    'Ivan Turgenev', 'Alexander Pushkin', 'Mikhail Bulgakov', 'Thomas Mann', 'Gunter Grass'
];

const genres = [
    'Fiction', 'Classic Literature', 'Science Fiction', 'Fantasy', 'Mystery',
    'Thriller', 'Romance', 'Historical Fiction', 'Horror', 'Adventure',
    'Philosophy', 'Poetry', 'Drama', 'Biography', 'Non-Fiction'
];

const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
    'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
    'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
    'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah'
];

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const streets = [
    'Main St', 'Oak Ave', 'Pine St', 'Maple Dr', 'Cedar Ln', 'Elm St', 'Washington St', 'Lake Ave',
    'Hill Rd', 'Park Ave', 'Broadway', 'Church St', 'Spring St', 'Forest Dr', 'River Rd'
];

const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
    'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Indianapolis'
];

// Helper functions
function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateISBN(): string {
    const prefix = '978';
    const group = getRandomInt(0, 9);
    const publisher = getRandomInt(1000, 9999);
    const title = getRandomInt(1000, 9999);
    const check = getRandomInt(0, 9);
    return `${prefix}-${group}-${publisher}-${title}-${check}`;
}

function generateEmail(firstName: string, lastName: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(domains)}`;
}

function generatePhone(): string {
    const area = getRandomInt(200, 999);
    const exchange = getRandomInt(200, 999);
    const number = getRandomInt(1000, 9999);
    return `(${area}) ${exchange}-${number}`;
}

function generateAddress(): string {
    const number = getRandomInt(1, 9999);
    const street = getRandomElement(streets);
    const city = getRandomElement(cities);
    const state = 'NY'; // Simplified for this example
    const zip = getRandomInt(10000, 99999);
    return `${number} ${street}, ${city}, ${state} ${zip}`;
}

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.loan.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.member.deleteMany({});
    console.log('✅ Existing data cleared');

    // Generate 500 books
    console.log('📚 Generating 500 books...');
    const books = [];
    for (let i = 0; i < 500; i++) {
        const titleBase = getRandomElement(bookTitles);
        const title = i < bookTitles.length ? titleBase : `${titleBase} - Volume ${Math.floor(i / bookTitles.length) + 1}`;

        books.push({
            isbn: generateISBN(),
            title,
            author: getRandomElement(authors),
            description: `A compelling work that explores themes of humanity, society, and the human condition. This edition includes critical analysis and historical context.`,
            genre: getRandomElement(genres),
            publishedYear: getRandomInt(1800, 2024),
            status: getRandomElement([BookStatus.AVAILABLE, BookStatus.AVAILABLE, BookStatus.AVAILABLE, BookStatus.BORROWED]) // 75% available
        });
    }

    await prisma.book.createMany({ data: books });
    console.log('✅ 500 books created');

    // Generate 500 members
    console.log('👥 Generating 500 members...');
    const members = [];
    for (let i = 0; i < 500; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);

        // Ensure unique email by always including index
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@example.com`;

        members.push({
            email,
            name: `${firstName} ${lastName}`,
            phone: generatePhone(),
            address: generateAddress(),
            status: getRandomElement([MemberStatus.ACTIVE, MemberStatus.ACTIVE, MemberStatus.ACTIVE, MemberStatus.SUSPENDED, MemberStatus.INACTIVE]), // 60% active
            maxLoans: getRandomInt(3, 10)
        });
    }

    await prisma.member.createMany({ data: members });
    console.log('✅ 500 members created');

    // Get statistics
    const bookCount = await prisma.book.count();
    const memberCount = await prisma.member.count();
    const availableBooks = await prisma.book.count({ where: { status: BookStatus.AVAILABLE } });
    const activeMembers = await prisma.member.count({ where: { status: MemberStatus.ACTIVE } });

    console.log('\n📊 Seeding completed successfully!');
    console.log(`   📚 Total Books: ${bookCount}`);
    console.log(`   📖 Available Books: ${availableBooks}`);
    console.log(`   👥 Total Members: ${memberCount}`);
    console.log(`   ✨ Active Members: ${activeMembers}`);
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
