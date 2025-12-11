/**
 * Export utilities for generating Excel/CSV files
 */

import { toast } from "sonner";

interface VoterData {
  studentId: string;
  walletAddress: string;
  department: string;
  registrationDate: string;
  hasVoted: boolean;
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data: VoterData[]): string {
  // CSV Headers
  const headers = ['Student ID', 'Wallet Address', 'Department', 'Registration Date', 'Voted'];

  // CSV Rows
  const rows = data.map(voter => [
    voter.studentId,
    // Show only first 10 and last 4 characters of wallet address for security
    `${voter.walletAddress.substring(0, 10)}...${voter.walletAddress.substring(voter.walletAddress.length - 4)}`,
    voter.department,
    new Date(voter.registrationDate).toLocaleDateString(),
    voter.hasVoted ? 'Yes' : 'No'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Export voters to Excel/CSV
 */
export function exportVotersToExcel(voters: VoterData[]): void {
  try {
    if (voters.length === 0) {
      toast.error("No voters to export");
      return;
    }

    toast.info("Preparing export...");
    const csvContent = convertToCSV(voters);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `APU-VOTE-Registered-Voters-${timestamp}.csv`;

    downloadCSV(csvContent, filename);
    toast.success(`Successfully exported ${voters.length} voter records!`);
  } catch (error) {
    console.error('Error exporting voters:', error);
    toast.error('Failed to export voter list');
    throw new Error('Failed to export voter list');
  }
}

/**
 * Export voters with additional statistics
 */
export function exportVotersWithStats(voters: VoterData[]): string {
  const totalVoters = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const notVotedCount = totalVoters - votedCount;
  const votingPercentage = totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(2) : '0';

  // Department breakdown
  const departmentStats = voters.reduce((acc, voter) => {
    acc[voter.department] = (acc[voter.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let statsContent = `APU VOTE - Registered Voters Export\n`;
  statsContent += `Export Date: ${new Date().toLocaleString()}\n\n`;
  statsContent += `=== STATISTICS ===\n`;
  statsContent += `Total Registered Voters: ${totalVoters}\n`;
  statsContent += `Voted: ${votedCount} (${votingPercentage}%)\n`;
  statsContent += `Not Voted: ${notVotedCount}\n\n`;
  statsContent += `=== DEPARTMENT BREAKDOWN ===\n`;
  Object.entries(departmentStats).forEach(([dept, count]) => {
    statsContent += `${dept}: ${count}\n`;
  });
  statsContent += `\n=== VOTER LIST ===\n\n`;

  const csvData = convertToCSV(voters);

  return statsContent + csvData;
}