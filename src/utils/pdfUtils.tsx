import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { Alert } from 'react-native';

/**
 * Generate a PDF file from HTML content and share it.
 * @param {string} fileName - The name of the PDF file.
 * @param {TransactionEntry[]} transaction - Array of transaction data.
 * @param {Customer} customer - Customer details.
 */

interface TransactionEntry {
    id: string;
    userId: string;
    phoneNumber: string;
    type: 'receive' | 'send';
    amount: number;
    name: string;
    imageurl: string;
    email: string;
    timestamp: string;
    userType: 'customer' | 'supplier';
    transationId: string;
}

interface Customer {
    userId: string;
    name: string;
    type: string;
    phoneNumber: string;
    email: string;
}

export const generateAndSharePDF = async (fileName: string, settlementAmount: number, transactions: TransactionEntry[], customer: Customer) => {
    // Calculate the total amount
    const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Generate transaction rows dynamically
    const transactionRows = transactions
        .map(transaction => `
            <tr>
                <td>${transaction.id}</td>
                <td>${customer.name}</td>
                <td>${transaction.timestamp}</td>
                <td>${transaction.type === 'send' ? 'Sent' : 'Received'}</td>
                <td>$${transaction.amount}</td>
            </tr>
        `)
        .join('');

    const htmlContent = `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                margin: 20px;
            }
            h1, h2 {
                color: #333;
            }
            table {
                width: 90%;
                margin-top:10px;
                margin: 20px auto;
                border-collapse: collapse;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            tfoot td {
                font-weight: bold;
                background-color: #f9f9f9;
            }
            .customer-info {
                margin-bottom: 30px;
                margin-left: 42px;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <h1>Transaction Report</h1>

        <div class="customer-info">
            <h2>Customer Details</h2>
            <p><strong>Name:</strong> ${customer.name}</p>
            <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Name</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${transactionRows}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" style="text-align: right;">Total Amount:</td>
                    <td>${settlementAmount}</td>
                </tr>
            </tfoot>
        </table>
    </body>
    </html>`;

    try {
        const options = {
            html: htmlContent,
            fileName,
            directory: 'Documents',
        };

        const file = await RNHTMLtoPDF.convert(options);
        if (file.filePath) {
            Alert.alert('PDF Generated', `Saved at: ${file.filePath}`);

            // Optional: Share the generated PDF
            const shareOptions = {
                title: 'Share Report',
                url: `file://${file.filePath}`,
                type: 'application/pdf',
            };

            await Share.open(shareOptions);
        }
    } catch (error) {
        console.error('Error creating PDF:', error);
    }
};
