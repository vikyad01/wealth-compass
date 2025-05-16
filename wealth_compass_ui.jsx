import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, ListChecks, TrendingUp, Newspaper, Shield, CalendarCheck, LineChart, Repeat, BookOpen, Brain, PiggyBank } from 'lucide-react';
import { LineChart as RechartLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function WealthCompassApp() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [portfolio, setPortfolio] = useState([{ symbol: '', amount: '' }]);
  const [portfolioValues, setPortfolioValues] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [goalInputs, setGoalInputs] = useState({ target: '', years: '', start: '', returnRate: '' });
  const [monthlyContribution, setMonthlyContribution] = useState(null);
  const [historyTicker, setHistoryTicker] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [rebalancing, setRebalancing] = useState([{ asset: '', current: '', target: '' }]);
  const [rebalanceOutput, setRebalanceOutput] = useState([]);
  const [IRA, setIRA] = useState(0);
  const [RothIRA, setRothIRA] = useState(0);

  const sendMessage = () => {
    if (!message) return;
    setChatLog([...chatLog, { sender: 'User', text: message }]);
    setMessage('');
  };

  const fetchPortfolioValues = async () => {
    const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
    const results = await Promise.all(
      portfolio.map(async ({ symbol, amount }) => {
        if (!symbol || !amount) return null;
        const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await res.json();
        const price = parseFloat(data['Global Quote']['05. price']);
        return { symbol, amount: parseFloat(amount), price, value: parseFloat(amount) / price };
      })
    );
    setPortfolioValues(results.filter(Boolean));
  };

  const fetchMarketNews = async () => {
    const API_KEY = 'YOUR_NEWSAPI_KEY';
    const res = await fetch(`https://newsapi.org/v2/everything?q=market%20economy&language=en&sortBy=publishedAt&apiKey=${API_KEY}`);
    const data = await res.json();
    setNewsArticles(data.articles.slice(0, 5));
  };

  const fetchHistoricalData = async () => {
    const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
    const res = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${historyTicker}&apikey=${API_KEY}`);
    const data = await res.json();
    const prices = data['Monthly Time Series'];
    const chartData = Object.keys(prices).slice(0, 12).reverse().map(date => ({
      date,
      close: parseFloat(prices[date]['4. close'])
    }));
    setHistoricalData(chartData);
  };

  const calculateGoal = () => {
    const { target, years, start, returnRate } = goalInputs;
    const fv = parseFloat(target);
    const n = parseInt(years) * 12;
    const r = parseFloat(returnRate) / 100 / 12;
    const pv = parseFloat(start || 0);
    const monthly = ((fv - pv * Math.pow(1 + r, n)) * r) / (Math.pow(1 + r, n) - 1);
    setMonthlyContribution(monthly);
  };

  const rebalance = () => {
    const total = rebalancing.reduce((sum, item) => sum + parseFloat(item.current || 0), 0);
    const output = rebalancing.map(item => {
      const current = parseFloat(item.current || 0);
      const target = parseFloat(item.target || 0);
      const currentPct = (current / total) * 100;
      const difference = target - currentPct;
      return { ...item, currentPct: currentPct.toFixed(1), difference: difference.toFixed(1) };
    });
    setRebalanceOutput(output);
  };

  useEffect(() => {
    fetchMarketNews();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 p-4 min-h-screen bg-gray-50">
      {/* Sidebar & Main Chat Panel omitted for brevity in export */}
      {/* Paste the complete JSX here from the canvas if needed */}
    </div>
  );
}
